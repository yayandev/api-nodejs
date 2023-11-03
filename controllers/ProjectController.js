export const AddProject = async (req, res) => {
  try {
    res.json({
      message: "Project created successfully",
      success: true,
      data: req.file.path,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
