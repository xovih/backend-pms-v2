const router = require("express").Router()
const moment = require("moment")
const pgDb = require("../utils/pgConn")
const socket = require("../utils/socket")

function whatIsMyStatus(mCon, cCon) {
  if (mCon == '0') {
    // Machine is ON
    if (cCon == '1') {
      return "idle"
    }

    return "run"
  } else {
    // Machine is OFF
    return "stop"
  }
}

function myCouplingIs(cop) {
  // Coupling is OFF
  if (cop == "1") {
    return "stop"
  }

  // Coupling is ON
  return "run"
}

router.post("/update", async (req, res) => {
  try {

    const id = req.body.ip_raspi

    let dataEmit = {}
    let mesin = {}

    if (id == "192.168.206.14") {
      const {
        state_date,
        state_time,
        state_mesin_regang_int,
        state_coupling_regang_int,
        state_mesin_mal_int_1,
        state_coupling_mal_int_1,
        state_mesin_mal_int_2,
        state_coupling_mal_int_2,
        state_mesin_bubut_int,
        state_coupling_bubut_int_1,
        state_coupling_bubut_int_2,
        Sensor_Regang_Integrated_1,
        Sensor_Mal_Integrated_1,
        Sensor_Mal_Integrated_2,
        Sensor_Bubut_Integrated_1_1,
        Sensor_Bubut_Integrated_1_2,
        Sensor_Bubut_Integrated_2_1,
        Sensor_Bubut_Integrated_2_2,
      } = req.body

      const waktu = moment(state_date, ["h:mm:ss A"]).format("HH:mm:ss")

      const regang_int = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_regang_int, state_coupling_regang_int),
        coupling: myCouplingIs(state_coupling_regang_int),
        counter1: Sensor_Regang_Integrated_1
      }

      const mal_int_1 = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_mal_int_1, state_coupling_mal_int_1),
        coupling: myCouplingIs(state_coupling_mal_int_1),
        counter1: Sensor_Mal_Integrated_1
      }

      const mal_int_2 = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_mal_int_2, state_coupling_mal_int_2),
        coupling: myCouplingIs(state_coupling_mal_int_2),
        counter1: Sensor_Mal_Integrated_2
      }

      const bubut_pinggir_1 = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_bubut_int, state_coupling_bubut_int_1),
        coupling: myCouplingIs(state_coupling_bubut_int_1),
        counter1: Sensor_Bubut_Integrated_1_1,
        counter2: Sensor_Bubut_Integrated_1_2
      }

      const bubut_pinggir_2 = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_bubut_int, state_coupling_bubut_int_2),
        coupling: myCouplingIs(state_coupling_bubut_int_2),
        counter1: Sensor_Bubut_Integrated_2_1,
        counter2: Sensor_Bubut_Integrated_2_2
      }

      mesin.regang_int = regang_int
      mesin.mal_int_1 = mal_int_1
      mesin.mal_int_2 = mal_int_2
      mesin.bubut_pinggir_1 = bubut_pinggir_1
      mesin.bubut_pinggir_2 = bubut_pinggir_2

      await pgDb.query(
        "INSERT INTO tbl_state_206_14(state_date, state_time, state_mesin_regang_int, state_coupling_regang_int, state_mesin_mal_int_1, state_coupling_mal_int_1, state_mesin_mal_int_2, state_coupling_mal_int_2, state_mesin_bubut_int, state_coupling_bubut_int_1, state_coupling_bubut_int_2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [
          state_date,
          state_time,
          state_mesin_regang_int,
          state_coupling_regang_int,
          state_mesin_mal_int_1,
          state_coupling_mal_int_1,
          state_mesin_mal_int_2,
          state_coupling_mal_int_2,
          state_mesin_bubut_int,
          state_coupling_bubut_int_1,
          state_coupling_bubut_int_2
        ]
      )

      dataEmit.id = "14"
      dataEmit.mesin = mesin

    } else if (id == "192.168.206.28") {
      const {
        state_date,
        state_time,
        state_mesin_cuci_bilas,
        state_mesin_oven,
        state_mesin_cuci_asam,
        state_mesin_botol_integrated,
        state_coupling_botol_integrated,
        state_mesin_bor_integrated,
        state_coupling_bor_integrated,
        state_mesin_bilas_p3,
        Sensor_Botol_Integrated_1_1,
        Sensor_Botol_Integrated_1_2,
        Sensor_Bor_Integrated_1_1,
        Sensor_Bor_Integrated_1_2,
      } = req.body

      const waktu = moment(state_date, ["h:mm:ss A"]).format("HH:mm:ss")

      const cuci_bilas = {
        status: state_mesin_cuci_bilas == "0" ? "run" : "idle"
      }

      const oven = {
        status: state_mesin_oven == "0" ? "run" : "idle"
      }

      const cuci_asam = {
        status: state_mesin_cuci_asam == "0" ? "run" : "idle"
      }

      const botol_integrated = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_botol_integrated, state_coupling_botol_integrated),
        coupling: myCouplingIs(state_coupling_botol_integrated),
        counter1: Sensor_Botol_Integrated_1_1,
        counter2: Sensor_Botol_Integrated_1_2
      }

      const bor_integrated = {
        count_time: waktu,
        status: whatIsMyStatus(state_mesin_bor_integrated, state_coupling_bor_integrated),
        coupling: myCouplingIs(state_coupling_bor_integrated),
        counter1: Sensor_Bor_Integrated_1_1,
        counter2: Sensor_Bor_Integrated_1_2
      }

      const bilas_p3 = {
        status: state_mesin_bilas_p3 == "0" ? "run" : "idle"
      }

      mesin.cuci_bilas = cuci_bilas
      mesin.oven = oven
      mesin.cuci_asam = cuci_asam
      mesin.botol_integrated = botol_integrated
      mesin.bor_integrated = bor_integrated
      mesin.bilas_p3 = bilas_p3

      await pgDb.query(
        "INSERT INTO tbl_state_206_28(state_date, state_time, state_mesin_cuci_bilas, state_mesin_oven, state_mesin_cuci_asam, state_mesin_botol_integrated, state_coupling_botol_integrated, state_mesin_bor_integrated, state_coupling_bor_integrated, state_mesin_bilas_p3) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          state_date,
          state_time,
          state_mesin_cuci_bilas,
          state_mesin_oven,
          state_mesin_cuci_asam,
          state_mesin_botol_integrated,
          state_coupling_botol_integrated,
          state_mesin_bor_integrated,
          state_coupling_bor_integrated,
          state_mesin_bilas_p3
        ]
      )

      dataEmit.id = "28"
      dataEmit.mesin = mesin
    }

    socket.emit("updateDashboard", dataEmit)

    return res.status(200).json({
      error: false,
      message: "Data state berhasil diinput ke DB dan diteruskan ke Front End",
      data: mesin
    })
  } catch (err) {
    return res.status(500).json(
      {
        error: true,
        message: "Internal server error",
        detail: err
      }
    )
  }
})

router.get("/mesin", async (req, res) => {
  try {
    const ms14 = await pgDb.query(
      "SELECT * FROM tbl_state_206_14 WHERE state_date IS NOT null ORDER BY state_date DESC, state_time DESC LIMIT 1"
    )
    const data14 = ms14.rows[0]

    const ms28 = await pgDb.query(
      "SELECT * FROM tbl_state_206_28 WHERE state_date IS NOT null ORDER BY state_date DESC, state_time DESC LIMIT 1"
    )
    const data28 = ms28.rows[0]

    const waktu14 = data14.state_time
    const waktu28 = data28.state_time

    let mesin = {
      regang_int: {
        status: whatIsMyStatus(data14.state_mesin_regang_int, data14.state_coupling_regang_int),
        last_count_time: waktu14,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data14.state_coupling_regang_int),
        sepur1_last_count: 0
      },
      mal_int_1: {
        status: whatIsMyStatus(data14.state_mesin_mal_int_1, data14.state_coupling_mal_int_1),
        last_count_time: waktu14,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data14.state_coupling_mal_int_1),
        sepur1_last_count: 0
      },
      mal_int_2: {
        status: whatIsMyStatus(data14.state_mesin_mal_int_2, data14.state_coupling_mal_int_2),
        last_count_time: waktu14,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data14.state_coupling_mal_int_2),
        sepur1_last_count: 0
      },
      bubut_pinggir_1: {
        status: whatIsMyStatus(data14.state_mesin_bubut_int, data14.state_coupling_bubut_int_1),
        last_count_time: waktu14,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data14.state_coupling_bubut_int_1),
        sepur1_last_count: 0,
        sepur2_count: 0,
        sepur2_status: myCouplingIs(data14.state_coupling_bubut_int_1),
        sepur2_last_count: 0
      },
      bubut_pinggir_2: {
        status: whatIsMyStatus(data14.state_mesin_bubut_int, data14.state_coupling_bubut_int_2),
        last_count_time: waktu14,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data14.state_coupling_bubut_int_2),
        sepur1_last_count: 0,
        sepur2_count: 0,
        sepur2_status: myCouplingIs(data14.state_coupling_bubut_int_2),
        sepur2_last_count: 0
      },
      cuci_bilas: {
        mesin: data28.state_mesin_cuci_bilas == "1" ? "iddle" : "run"
      },
      oven: {
        mesin: data28.state_mesin_oven == "1" ? "iddle" : "run"
      },
      cuci_asam: {
        mesin: data28.state_mesin_cuci_asam == "1" ? "iddle" : "run"
      },
      botol_integrated: {
        status: whatIsMyStatus(data28.state_mesin_botol_integrated, data28.state_coupling_botol_integrated),
        last_count_time: waktu28,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data28.state_coupling_botol_integrated),
        sepur1_last_count: 0,
        sepur2_count: 0,
        sepur2_status: myCouplingIs(data28.state_coupling_botol_integrated),
        sepur2_last_count: 0
      },
      bor_integrated: {
        status: whatIsMyStatus(data28.state_mesin_bor_integrated, data28.state_coupling_bor_integrated),
        last_count_time: waktu28,
        sepur1_count: 0,
        sepur1_status: myCouplingIs(data28.state_coupling_bor_integrated),
        sepur1_last_count: 0,
        sepur2_count: 0,
        sepur2_status: myCouplingIs(data28.state_coupling_bor_integrated),
        sepur2_last_count: 0
      },
      bilas_p3: {
        mesin: data28.state_mesin_bilas_p3 == "1" ? "iddle" : "run"
      }
    }


    res.status(200).json({
      error: false,
      message: "Successfully get all machine data !",
      data: mesin
    })
  } catch (err) {
    return res.status(500).json(
      {
        error: true,
        message: "Internal server error",
        detail: err
      }
    )
  }
})

module.exports = router