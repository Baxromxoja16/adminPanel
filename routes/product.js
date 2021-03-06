const { Router } = require("express");
const router = Router();
const Category = require("../models/Category");
const fileUpload = require("../middleware/fileUpload");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const toDelete = require("../middleware/toDelete");

router.get("/view", auth, async (req, res) => {
  const products = await Product.find();

  res.render("admin/products", {
    header: "Mahsulotlarni ko`rish",
    title: "Mahsulotlar",
    layout: "main",
    products,
  });
});

router.get("/add", auth, async (req, res) => {
  const categories = await Category.find();
  res.render("admin/productCreate", {
    header: "Mahsulot yaratish",
    layout: "main",
    categories,
  });
});

router.post("/add", auth, fileUpload.single("img"), async (req, res) => {
  const { name, price, categoryId } = req.body;
  console.log(req.file);
  const img = req.file.filename;

  const product = new Product({
    name,
    price,
    img,
    categoryId,
  });

  await product.save();
  res.redirect("/admin/product/view");
});

router.get("/edit/:id", auth, async (req, res) => {
  const categories = await Category.find();
  const product = await Product.findById(req.params.id);
  console.log(product);
  res.render("admin/productEdit", {
    product,
    categories,
    header: "Productlarni yangilash",
    title: "Productlarni yangilash",
    layout: "main",
  });
});

router.post("/edit/:id", auth, fileUpload.single("img"), async (req, res) => {
  const { img } = await Product.findById(req.params.id);
  const product = req.body;

  if (req.file) {
    toDelete(img);
    product.img = req.file.filename;
  }

  await Product.findByIdAndUpdate(req.params.id, product, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin/product/view");
    }
  });
});

router.get("/delete/:id", auth, async (req, res) => {
  const { img } = await Product.findById(req.params.id);

  await Product.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(img);
      res.redirect("/admin/product/view");
    }
  });
});

module.exports = router;
