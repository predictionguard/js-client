import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Factuality() {
    const fact =
        'The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.';
    const text = 'The president of the united states can take a salary of one million dollars';

    var [result, err] = await client.Factuality.Do(fact, text);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + JSON.stringify(result.checks[0]));
}

Factuality();
