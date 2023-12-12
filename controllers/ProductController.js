import { db } from "../utils/prisma.js";
import fs from "fs";
export const getAllProducts = async (req, res) => {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        id_image: true,
      },
    });

    return res.status(200).json({
      message: "Products found successfully",
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product found successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const authorId = req.user.id;
    const file = req.file;
    const body = req.body;
    const { name, description, price } = body;

    if (!file || !name || !description || !price) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const image =
      "https" + "://" + req.get("host") + "/uploads/" + file.filename;
    const id_image = file.filename;

    const newProduct = await db.product.create({
      data: {
        name,
        description,
        price,
        image,
        id_image,
        authorId,
      },
    });

    if (!newProduct) {
      return res.status(400).json({
        message: "Product not created",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product created successfully",
      success: true,
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const authorId = req.user.id;

    const file = req.file;

    const post = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (authorId !== post.authorId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const body = req.body;

    const { name, description, price } = body;

    if (!name || !description || !price) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    if (file) {
      const image =
        "https" + "://" + req.get("host") + "/uploads/" + file.filename;
      const id_image = file.filename;

      const oldImage = post.id_image;

      fs.unlinkSync("./public/uploads/" + oldImage);

      const updatedProduct = await db.product.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          price,
          image,
          id_image,
        },
      });

      return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        data: updatedProduct,
      });
    }

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const authorId = req.user.id;

    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    if (authorId !== product.authorId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const oldImage = product.id_image;

    fs.unlinkSync("./public/uploads/" + oldImage);

    const deletedProduct = await db.product.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
