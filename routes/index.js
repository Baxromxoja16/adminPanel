const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const categories = await Category.find();
  res.render("index", {
    title: "Express",
    categories,
  });
});
router.get("/read/:id", async (req, res) => {
  const { categoryName } = await Category.findById(req.params.id);
  let products = await Category.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "mahsulotlar",
      },
    },
    {
      $unwind: {
        path: "$mahsulotlar",
      },
    },
    {
      $group: {
        _id: {
          _id: "$_id",
        },
        mahsulotlar: {
          $push: "$mahsulotlar",
        },
      },
    },
    {
      $project: {
        _id: "$id._id",
        name: "$_id.name",
        price: "$_id.price",
        img: "$_id.img",
        mahsulotlar: "$mahsulotlar",
      },
    },
  ]);

  // res.send(products[0].mahsulotlar)
  products = products[0].mahsulotlar;

  res.render("admin/category", {
    header: categoryName,
    products,
    title: categoryName,
    layout: "layout",
  });
});

module.exports = router;
