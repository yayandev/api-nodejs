import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  },
});

export const upload = multer({ storage: storage });
