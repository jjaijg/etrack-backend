const pdf = require('pdf-creator-node');
const fs = require('fs');

const genPdf = async (email, transactions) => {
  try {
    // options
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      header: {
        height: '45mm',
        contents: '<div style="text-align: center;">Etracker-Report</div>',
      },
      footer: {
        height: '28mm',
        contents: {
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page',
        },
      },
    };

    // Read HTML Template
    const html = fs.readFileSync('./templates/daily.html', 'utf8');

    let filePath = `./reports/${email}/daily.pdf`;
    // setup doc
    const document = {
      html: html,
      data: {
        email,
        transactions,
      },
      path: filePath,
    };

    // create PDF
    return await pdf.create(document, options);
  } catch (error) {
    console.log('Error in pdf generator : ', error);
  }
};

module.exports = genPdf;
