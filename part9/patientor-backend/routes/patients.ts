import express from 'express';

const router = express.Router();

import patientsService from '../services/patientsService';
import toNewPatientEntry from '../utils';

router.get('/', (_req, res) => {
    res.send(patientsService.getAllPatients());
});

router.get('/:patientId', (req, res) => {
    res.send(patientsService.getOne(req.params.patientId));
});

router.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);
        const addedPatientEntry = patientsService.addPatient(newPatientEntry);
        res.json(addedPatientEntry);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        res.status(400).send(e.message);
    }
});


export default router;
