import io.ktor.application.*
import io.ktor.html.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.html.*
import java.io.File

// Function to handle text file upload
fun uploadText(part: PartData.FileItem, fileName: String) {
    val folder = File("uploads/texts")
    folder.mkdirs()  // Ensure the directory exists
    val file = File(folder, fileName)
    file.writeBytes(part.streamProvider().readBytes())
}

fun main() {
    val server = embeddedServer(Netty, port = 8080) {
        install(io.ktor.features.CORS) {
            method(HttpMethod.Options)
            method(HttpMethod.Put)
            method(HttpMethod.Delete)
            method(HttpMethod.Patch)
            header(HttpHeaders.Authorization)
            allowCredentials = true
            anyHost()
        }

        routing {
            static("/static") {
                resources("static")
            }

            get("/index") {
                call.respondHtml {
                    head {
                        title("Index Page")
                    }
                    body {
                        h1 { +"Welcome to the Index Page" }
                        p {
                            a(href = "/static/index.html") { +"Click here to view the index.html file" }
                        }
                    }
                }
            }

            static("/uploads") {
                files("uploads")  // Directly using the 'uploads' directory
            }

            post("/upload") {
                val multipart = call.receiveMultipart()
                var responseMessage = ""
                
                multipart.forEachPart { part ->
                    when (part) {
                        is PartData.FileItem -> {
                            val fileName = part.originalFileName ?: "unnamed"
                            if (part.contentType?.match(ContentType.Video.MP4) == true) {
                                val folder = File("uploads/videos")  // Direct reference
                                folder.mkdirs() // Ensure the directory exists
                                val file = File(folder, fileName)
                                file.writeBytes(part.streamProvider().readBytes())
                                responseMessage += "Video file uploaded successfully: $fileName\n"
                            } else if (part.contentType?.match(ContentType.Text.Plain) == true) {
                                uploadText(part, fileName)
                                responseMessage += "Text file uploaded successfully: $fileName\n"
                            } else {
                                responseMessage += "Unsupported file type: $fileName\n"
                            }
                        }
                        else -> println("Received an unhandled part of type: ${part::class.simpleName}")
                    }
                    part.dispose()
                }
                
                call.respondText(responseMessage, status = HttpStatusCode.OK)
            }
        }
    }
    server.start(wait = true)
}
