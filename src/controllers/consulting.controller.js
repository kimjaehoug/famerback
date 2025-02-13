const { default: axios } = require("axios");

exports.consult = async (req, res) => {
  console.log(req.body);
  const {
    companyName,
    districtType,
    industry,
    infras,
    investmentScale,
    explanation,
    author,
  } = req.body;

  await axios
    .post(`${process.env.PYTHON_API}/recommend`, {
      business_data: [
        {
          특구종류: districtType,
          기업명: companyName,
          산업군: industry,
          "사업 설명": explanation,
          "투자 규모 (억원)": investmentScale,
          인프라: infras,
        },
      ],
    })
    .then((data) => {
      console.log(data);
      res.status(200).json({ data: data.data });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ err });
    });
};
