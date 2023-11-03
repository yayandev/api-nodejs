import cloudinary from "../utils/cloduinary.js";
export const AddProject = async (req, res) => {
  try {
    const file = await req.file;

    if (!file) {
      return res.status(400).json({
        message: "Please upload a file",
        success: false,
      });
    }

    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return res
            .status(500)
            .send("Gagal mengunggah file ke Cloudinary: " + error.message);
        }

        const cloudinaryUrl = result.url;

        res.json({
          message: "File uploaded successfully",
          success: true,
          url: cloudinaryUrl,
        });
      })
      .end(file.buffer);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
