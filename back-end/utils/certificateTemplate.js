const generateCertificateHTML = (studentName, courseTitle, sessionYear = '2025-26') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course-Craft Certificate</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    body {
      background: #e0e0e0;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .certificate-wrapper {
      width: 850px;
      height: 600px;
      padding: 30px;
      background: #fff;
      border: 15px solid #1f3c88;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
      box-sizing: border-box;
    }

    .certificate-wrapper::after {
      content: '';
      position: absolute;
      top: 10px;
      bottom: 10px;
      left: 10px;
      right: 10px;
      border: 2px solid #d4af37;
      pointer-events: none;
    }

    .certificate-header {
      text-align: center;
      margin-top: 40px;
    }

    .certificate-header h1 {
      font-family: 'Cinzel', serif;
      font-size: 42px;
      color: #1f3c88;
      margin: 0;
      text-transform: uppercase;
    }

    .certificate-header p {
      font-family: 'Libre Baskerville', serif;
      font-size: 16px;
      color: #777;
      margin-top: 5px;
    }

    .certificate-body {
      text-align: center;
      margin-top: 50px;
      font-family: 'Libre Baskerville', serif;
    }

    .certificate-body p {
      font-size: 18px;
      color: #444;
      margin: 5px 0;
    }

    .student-name {
      font-size: 45px;
      font-weight: bold;
      color: #222;
      margin: 15px 0;
      display: inline-block;
      font-family: 'Cinzel', serif;
    }

    .name-underline {
      width: 80%;
      height: 2px;
      background: #1f3c88;
      margin: 0 auto 20px;
    }

    .course-title {
      font-size: 24px;
      font-style: italic;
      font-weight: bold;
      color: #1f3c88;
      margin-top: 10px;
    }

    .certificate-footer {
      display: flex;
      justify-content: space-around;
      margin-top: 70px;
      font-family: 'Libre Baskerville', serif;
    }

    .footer-box {
      text-align: center;
      width: 200px;
    }

    .footer-box strong {
      display: block;
      font-size: 14px;
      color: #555;
    }

    .footer-box span {
      display: block;
      border-top: 1px solid #1f3c88;
      margin-top: 35px;
      padding-top: 5px;
      font-weight: bold;
      font-size: 16px;
    }

    .seal {
      width: 80px;
      height: 80px;
      background: #d4af37;
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 10px;
      text-align: center;
      border: 2px dashed rgba(255,255,255,0.5);
    }

    .certificate-id {
      position: absolute;
      bottom: 20px;
      right: 30px;
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #aaa;
    }

    @media print {
      body { background: none; padding: 0; }
      .certificate-wrapper { box-shadow: none; border: 15px solid #1f3c88 !important; }
    }
  </style>
</head>
<body>

  <div class="certificate-wrapper">
    
    <div class="certificate-header">
      <h1>Certificate</h1>
      <p>OF COMPLETION</p>
    </div>

    <div class="certificate-body">
      <p>This is to certify that</p>
      <div class="student-name">${studentName}</div>
      <div class="name-underline"></div>
      <p>has successfully completed the requirements for</p>
      <div class="course-title">${courseTitle}</div>
    </div>

    <div class="certificate-footer">
      <div class="footer-box">
        <strong>Academic Session</strong>
        <span>${sessionYear}</span>
      </div>
      <div class="footer-box">
        <strong>Authorized By</strong>
        <span>Course-Craft Academy</span>
      </div>
    </div>

    <div class="seal">OFFICIAL<br>GRADUATE</div>

  </div>

</body>
</html>
  `;
};

module.exports = { generateCertificateHTML };
