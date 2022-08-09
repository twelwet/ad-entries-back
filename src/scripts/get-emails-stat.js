'use strict';

const {getJsonFromCsv} = require(`../utils`);

getJsonFromCsv(`src/download/emails-with-company-type.csv`)
  .then((data) => {
    const onlyEmails = data.filter((item) => item.email.includes(`@`));
    const companyTypes = [...(new Set(onlyEmails.map((item) => item[`companyType`])))];

    const result = [];
    for (const companyType of companyTypes) {
      const entriesByCompanyType = onlyEmails.filter((item) => item[`companyType`] === companyType);
      const entriesAll = entriesByCompanyType.length;
      const entriesActive = entriesByCompanyType.filter((item) => item[`lastLogon`].includes(`2022`)).length;
      const entriesNotUsed = entriesByCompanyType.filter((item) => item[`lastLogon`] === ``).length;
      const entriesNotActive = entriesAll - (entriesActive + entriesNotUsed);

      result.push({
        type: companyType,
        entriesAll,
        entriesActive,
        entriesNotActive,
        entriesNotUsed,
      });
    }

    console.table(result);
  });
