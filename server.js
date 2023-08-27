const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
const port = 3002;
app.use(cors())

app.use(bodyParser.json());

// Serve your static files if needed
app.use(express.static("public"));

app.post("/generate-pdf", (req, res) => {
  console.log('shesvla')
  console.log(req.body)
  const { htmlContent } = req.body;
  if(!htmlContent) {
    console.log('ara')
  return
  }
  console.log('ki')
  // Use wkhtmltopdf command to generate PDF
  const wkhtmltopdf = spawn("wkhtmltopdf", ["-", "-"]);
  wkhtmltopdf.stdin.write(htmlContent);
  wkhtmltopdf.stdin.end();

  res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
  res.setHeader("Content-Type", "application/pdf");

  wkhtmltopdf.stdout.pipe(res);
  res.end()
  return
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

