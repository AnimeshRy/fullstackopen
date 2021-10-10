/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import patientsData from '../data/patients.json';

import { PatientEntry, ssnFreePatientEntry, NewPatientEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

const patients: Array<ssnFreePatientEntry> = patientsData;

const getAllPatients = (): Array<ssnFreePatientEntry> => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};

const getOne = (id: string): ssnFreePatientEntry | undefined => {
    return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const id = uuidv4();
    const newPatientEntry = {
        id: id,
        ...entry
    };
    patients.push(newPatientEntry);
    return newPatientEntry;
};

export default {
    getAllPatients,
    addPatient,
    getOne
};
