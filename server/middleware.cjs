
module.exports = (req, res, next) => {
  const yazma = ["POST", "PUT", "PATCH"].includes(req.method);
  const ad = req.body && typeof req.body.ad === "string" ? req.body.ad : "";
  if (yazma && ad.toLowerCase().includes("hata-test")) {
    return res.status(500).json({ message: "Sunucu hatası: kayıt kaydedilemedi (simüle edildi)." });
  }
  next();
};
