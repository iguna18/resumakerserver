const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const PDFDocument = require("pdfkit");
const app = express();
const port = 3002;
app.use(cors())

app.use(bodyParser.json());

// Serve your static files if needed
app.use(express.static("public"));


app.post("/getpdf", (req, res) => {
  const body = req.body;
  console.log(body)
/*
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.text(`Name: ${name}`);
  doc.text(`Age: ${age}`);
  doc.text(`Education: ${education}`);
  if (experience !== null) {
    doc.text(`Experience: ${experience}`);
  }
  doc.text(`Phone Number: ${phone_number}`);

  doc.end();*/
});

app.post("/generate-pdf", (req, res) => {
  console.log('shesvla')
//  console.log(req.body)
  const { htmlContent } = req.body;
  if(!htmlContent) {
    console.log('ara')
  return
  }
  console.log('ki', Object.keys(htmlContent))
  // Use wkhtmltopdf command to generate PDF
  const wkhtmltopdf = spawn("wkhtmltopdf", ["-", "-"]);
  wkhtmltopdf.on("error", (error) => {
    console.error("Error during PDF generation:", error);
    res.status(500).send("Error during PDF generation");
  });
  wkhtmltopdf.stdin.write(htmlContent);
  wkhtmltopdf.stdin.end();

  res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
  res.setHeader("Content-Type", "application/pdf");

  wkhtmltopdf.stdout.pipe(res);
  return
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

