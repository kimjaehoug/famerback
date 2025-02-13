const { default: axios } = require("axios");

exports.consult = async (req, res) => {
  console.log("AAAAAA");
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
  console.log("DDDDD");

  const b = {
    business_data: [
      {
        특구종류: "규제자유특구",
        기업명: companyName,
        산업군: industry,
        "사업 설명": "블록체인을 이용하는 기업이다.",
        "투자 규모 (억원)": investmentScale,
        인프라: infras,
        법인세: corpTax,
        재산세: propertyTax,
        부지크기: landSize,
        임대료: rent,
      },
    ],
  };

  console.log(explanation);

  await axios
    .post(`${process.env.PYTHON_API}/recommend/`, b)
    .then((data) => {
      console.log("BBBBB");
      res.status(200).json({ data: data.data });
    })
    .catch((err) => {
      console.log(err);
      if (err.status === 500) {
        res.status(200).json({ data: null });
      } else {
        res.status(400).json({ err });
      }
    });
};
