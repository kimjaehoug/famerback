const { default: axios } = require("axios");

exports.consult = async (req, res) => {
  console.log(req.body);
  const {
    companyName,
    industry,
    infras,
    investmentScale,
    explanation,
    corpTax,
    propertyTax,
    landSize,
    rent,
  } = req.body;

  await axios
    .post(`${process.env.PYTHON_API}/recommend`, {
      business_data: [
        {
          특구종류: "규제자유특구",
          기업명: companyName,
          산업군: industry,
          "사업 설명": explanation,
          "투자 규모 (억원)": investmentScale,
          인프라: infras,
          법인세: corpTax,
          제산세: propertyTax,
          부지크기: landSize,
          임대료: rent,
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
