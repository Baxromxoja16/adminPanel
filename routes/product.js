const { Router } = require("express");
const router = Router();
const Category = require("../models/Category");
const fileUpload = require("../middleware/fileUpload");
const Product = require("../models/Product");
const toDelete = require('../middleware/toDelete')

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
  console.log(img);


  const product = new Product({
    name,
    price,
    img,
    categoryId,
  });

  await product.save();
  res.redirect("/admin/product/view");
});

router.get("/edit/:id", async (req, res) => {
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

router.post('/edit/:id', fileUpload.single("img"), async (req, res) => {
  const { img } = await Product.findById(req.params.id)
  const product = req.body

  if (req.body) {
    toDelete(img)
    product.img = req.file.filename
  }

  await Product.findByIdAndUpdate(req.params.id, product, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(img)
      res.redirect('/admin/product/view')
    }
  })

})

module.exports = router;
