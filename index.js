const express = require("express");
const cors = require("cors");
const fs = require("fs");
const moment = require("moment");

const app = express();
const port = 8080;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

app.post("/saveData", (req, res) => {
  const participantId = req.body.participantId;
  const eegResult = req.body.eegResult;
  const experiment = req.body.experiment;

  if (experiment == "n170") {
    writeN170(
      participantId,
      req.body.isAuxConnected,
      eegResult,
      req.body.n170Readings
    );
  } else if (experiment == "xab") {
    writeXAB(
      participantId,
      req.body.isAuxConnected,
      eegResult,
      req.body.xabReadings
    );
  } else {
    writeGeneral(participantId, req.body.isAuxConnected, eegResult, experiment);
  }

  res.status(200).send("Success");
});

function writeN170(participantId, isAuxConnected, eegResult, n170Readings) {
  const eegFile =
    "data/" +
    participantId +
    "_n170_eeg_" +
    moment(new Date()).format("YYYYMMDDHHmmss") +
    ".csv";

  let header, records;
  if (isAuxConnected) {
    header = [
      "timeStamp, index, ch_0, ch_1, ch_2, ch_3, ch_4, participant_id, type, gender, face_orientation, eye_orientation, smile, teeth",
    ];

    records = eegResult.map(
      (record) =>
        `${record.timestamp}, ${record.index}, ${record.ch_0}, ${record.ch_1}, ${record.ch_2}, ${record.ch_3}, ${record.ch_4}, ${record.participant_id}, ${record.type}, ${record.gender}, ${record.face_orientation}, ${record.eye_orientation}, ${record.smile}, ${record.teeth}`
    );
  } else {
    header = [
      "timeStamp, index, ch_0, ch_1, ch_2, ch_3, participant_id, type, gender, face_orientation, eye_orientation, smile, teeth",
    ];

    records = eegResult.map(
      (record) =>
        `${record.timestamp}, ${record.index}, ${record.ch_0}, ${record.ch_1}, ${record.ch_2}, ${record.ch_3}, ${record.participant_id}, ${record.type}, ${record.gender}, ${record.face_orientation}, ${record.eye_orientation}, ${record.smile}, ${record.teeth}`
    );
  }

  fs.writeFile(eegFile, header.concat(records).join("\n"), (err) => {
    if (err) {
      console.log("Error while writing file", err);
    } else {
      console.log("File created");
    }
  });

  const n170File =
    "data/" +
    participantId +
    "_n170_readings_" +
    moment(new Date()).format("YYYYMMDDHHmmss") +
    ".csv";
  const n170Header = [
    "timestamp, participant_id, type, gender, face_orientation, eye_orientation, smile, teeth",
  ];
  const n170Records = n170Readings.map(
    (record) =>
      `${record.timestamp}, ${record.participant_id}, ${record.type}, ${record.gender}, ${record.face_orientation}, ${record.eye_orientation}, ${record.smile}, ${record.teeth}`
  );

  fs.writeFile(n170File, n170Header.concat(n170Records).join("\n"), (err) => {
    if (err) {
      console.log("Error while writing file", err);
    } else {
      console.log("File created");
    }
  });
}

function writeXAB(participantId, isAuxConnected, eegResult, xabReadings) {
  const eegFile =
    "data/" +
    participantId +
    "_xab_eeg_" +
    moment(new Date()).format("YYYYMMDDHHmmss") +
    ".csv";

  let header, records;
  if (isAuxConnected) {
    header = ["Timestamp, Index, ch_0, ch_1, ch_2, ch_3, ch_4, participant_id"];
    records = eegResult.map(
      (record) =>
        `${record.timestamp}, ${record.index}, ${record.ch_0}, ${record.ch_1}, ${record.ch_2}, ${record.ch_3}, ${record.ch_4}, ${record.participant_id}`
    );
  } else {
    header = ["Timestamp, Index, ch_0, ch_1, ch_2, ch_3, participant_id"];
    records = eegResult.map(
      (record) =>
        `${record.timestamp}, ${record.index}, ${record.ch_0}, ${record.ch_1}, ${record.ch_2}, ${record.ch_3}, ${record.participant_id}`
    );
  }

  fs.writeFile(eegFile, header.concat(records).join("\n"), (err) => {
    if (err) {
      console.log("Error while writing file", err);
    } else {
      console.log("File created");
    }
  });

  const xabFile =
    "data/" +
    participantId +
    "_xab_readings_" +
    moment(new Date()).format("YYYYMMDDHHmmss") +
    ".csv";
  const xabHeader = [
    "stimuli_timestamp, start_timestamp, timestamp, selection, mode, correctness, participant_id, left_gender, left_face_orientation, left_eye_orientation, left_smile, left_teeth, right_gender, right_face_orientation, right_eye_orientation, right_smile, right_teeth",
  ];
  const xabRecords = xabReadings.map(
    (record) =>
      `${record.stimuli_timestamp}, ${record.start_timestamp}, ${record.timestamp}, ${record.selection}, ${record.mode}, ${record.correctness}, ${record.participant_id}, ${record.left_gender}, ${record.left_face_orientation}, ${record.left_eye_orientation}, ${record.left_smile}, ${record.left_teeth}, ${record.right_gender}, ${record.right_face_orientation}, ${record.right_eye_orientation}, ${record.right_smile}, ${record.right_teeth}`
  );

  fs.writeFile(xabFile, xabHeader.concat(xabRecords).join("\n"), (err) => {
    if (err) {
      console.log("Error while writing file", err);
    } else {
      console.log("File created");
    }
  });
}

function writeGeneral(
  participantId,
  isAuxConnected,
  eegResult,
  experimentName
) {
  const generalFile =
    "data/" +
    participantId +
    "_" +
    experimentName +
    "_eeg_" +
    moment(new Date()).format("YYYYMMDDHHmmss") +
    ".csv";

  let header, records;
  if (isAuxConnected) {
    header = ["Timestamp, Index, ch_0, ch_1, ch_2, ch_3, ch_4, participant_id"];
    records = eegResult.map(
      (record) =>
        `${record.timestamp}, ${record.index}, ${record.ch_0}, ${record.ch_1}, ${record.ch_2}, ${record.ch_3}, ${record.ch_4}, ${record.participant_id}`
    );
  } else {
    header = ["Timestamp, Index, ch_0, ch_1, ch_2, ch_3, participant_id"];
    records = eegResult.map(
      (record) =>
        `${record.timestamp}, ${record.index}, ${record.ch_0}, ${record.ch_1}, ${record.ch_2}, ${record.ch_3}, ${record.participant_id}`
    );
  }

  fs.writeFile(generalFile, header.concat(records).join("\n"), (err) => {
    if (err) {
      console.log("Error while writing file", err);
    } else {
      console.log("File created");
    }
  });
}

app.listen(port, () =>
  console.log("Node application started at port: " + port)
);
