import diagnosesData from '../data/diagnoses.json';

import { DiagnoseEntry } from '../types';

const diagnoses: Array<DiagnoseEntry> = diagnosesData;

const getAllDiagnoses = (): Array<DiagnoseEntry> => {
    return diagnoses;
};

export default {
    getAllDiagnoses
};
