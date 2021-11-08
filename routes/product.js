const { Router } = require("express");
const router = Router();
const Category = require("../models/Category");
const fileUpload = require("../middleware/fileUpload");
const Product = require("../models/Product");

router.get("/view", async (req, res) => {
  const products = await Product.find();

  res.render("admin/products", {
    header: "Mahsulotlarni ko`rish",
    title: "Mahsulotlar",
    layout: "main",
    products,
  });
});

router.get("/add", async (req, res) => {
  const categories = await Category.find();
  res.render("admin/productCreate", {
    header: "Mahsulot yaratish",
    layout: "main",
    categories,
  });
});

router.post("/add", fileUpload.single("img"), async (req, res) => {
  const { name, price, categoryId } = req.body;
  console.log(req.body);
  const { img } = req.file.filename;


  const product = new Product({
    name,
    price,
    categoryId,
    img,
  });

  await product.save();
  res.redirect("/admin/product/view");
});

router.get("/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/productEdit", {
    product,
    header: "Productlarni yangilash",
    DataTransferItemList: "Productlarni yangilash",
    layout: "layout",
  });
});

module.exports = router;
