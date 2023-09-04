const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const PDFDocument = require("pdfkit");
const app = express();
const port = 3002;
app.use(cors())

app.use(bodyParser.json({limit:'10mb'}));

// Serve your static files if needed
app.use(express.static("public"));

app.post("/getpdf", async (req, res) => {
  const { name, image } = req.body;
  const doc = new PDFDocument();
  console.log('\n\n\nerti\n\n\n')
  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=generated.pdf`);

  // Load the font
  doc.font('fonts/sylfaen.ttf');
  console.log('\n\n\nori\n\n\n')
  // Draw the image
  doc.image(image);

  // Add the name text
  doc.moveDown();
  doc.text(`Name: ${name}`);
  console.log('\n\n\nsami\n\n\n')
  // Finalize the PDF document and send as the response
  doc.end();
  doc.pipe(res);
});
/*
app.post("/getpdf", (req, res) => {
  const {name, image} = req.body;
  //console.log(name)
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=generated.pdf`);
  doc.font('fonts/sylfaen.ttf')
  doc.pipe(res);

  doc.image(image, doc.page.width - doc.page.width / 3, 0, {
    fit: [doc.page.width / 3, doc.page.height / 5],
  });
  doc.image(image);
  doc.moveDown();
  doc.text(`Name: ${name}`);
  doc.end();
});
*/
/*
app.post("/getpdf", (req, res) => {
  const { name, image } = req.body;
  const doc = new PDFDocument();
  console.log('giogiogio\n\n')
  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=generated.pdf`);

  // Pipe the PDF document directly to the response stream
  doc.pipe(res);

  // Load the font
  doc.font('fonts/sylfaen.ttf');
  console.log('\n\n\n\nnuli\n\n\n')
  // Draw the image and text
  const imageStream = doc.image(image);
  imageStream.on("finish", () => {
    console.log('\n\n\n\nerti\n\n\n')
    // The image stream has finished writing, so we can now write the text
    doc.moveDown();
    doc.text(`Name: ${name}`);

    // End the PDF document now that all content has been written
    doc.end();
  });

  imageStream.on("error", (error) => {
    console.log('\n\n\n\nori\n\n\n')
    console.error("Error writing image to PDF:", error);
    // Handle the error if necessary
    doc.end();
  });
});
*/
/*
app.post("/getpdf", async (req, res) => {
  const { name, image } = req.body;
  const doc = new PDFDocument();

  // Load the font
  doc.font('fonts/sylfaen.ttf');

  // Draw the image and text
  const imageStream = doc.image(image);
  imageStream.on("finish", () => {
    // The image stream has finished writing, so we can now write the text
    doc.moveDown();
    doc.text(`Name: ${name}`);

    // Generate the PDF content as a buffer
    const pdfBuffer = [];
    doc.on("data", (chunk) => {
      pdfBuffer.push(chunk);
    });

    doc.on("end", () => {
      // All content has been written to the buffer
      const pdfContent = Buffer.concat(pdfBuffer);

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=generated.pdf`);

      // Send the PDF content as the response
      res.end(pdfContent);
    });

    // Finalize the PDF document
    doc.end();
  });

  imageStream.on("error", (error) => {
    console.error("Error writing image to PDF:", error);
    // Handle the error if necessary
    res.status(500).send("Error generating PDF");
  });
});
*/


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

