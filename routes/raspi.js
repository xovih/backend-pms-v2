const router = require("express").Router()
const pgDb = require("../utils/pgConn")
const socket = require("../utils/socket")

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

      const regang_int = {
        mesin: state_mesin_regang_int,
        coupling: state_coupling_regang_int,
        counter1: Sensor_Regang_Integrated_1
      }

      const mal_int_1 = {
        mesin: state_mesin_mal_int_1,
        coupling: state_coupling_mal_int_1,
        counter1: Sensor_Mal_Integrated_1
      }

      const mal_int_2 = {
        mesin: state_mesin_mal_int_2,
        coupling: state_coupling_mal_int_2,
        counter1: Sensor_Mal_Integrated_2
      }

      const bubut_pinggir_1 = {
        mesin: state_mesin_bubut_int,
        coupling: state_coupling_bubut_int_1,
        counter1: Sensor_Bubut_Integrated_1_1,
        counter2: Sensor_Bubut_Integrated_1_2
      }

      const bubut_pinggir_2 = {
        mesin: state_mesin_bubut_int,
        coupling: state_coupling_bubut_int_2,
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

      const cuci_bilas = {
        mesin: state_mesin_cuci_bilas
      }

      const oven = {
        mesin: state_mesin_oven
      }

      const cuci_asam = {
        mesin: state_mesin_cuci_asam
      }

      const botol_integrated = {
        mesin: state_mesin_botol_integrated,
        coupling: state_coupling_botol_integrated,
        counter1: Sensor_Botol_Integrated_1_1,
        counter2: Sensor_Botol_Integrated_1_2
      }

      const bor_integrated = {
        mesin: state_mesin_bor_integrated,
        coupling: state_coupling_bor_integrated,
        counter1: Sensor_Bor_Integrated_1_1,
        counter2: Sensor_Bor_Integrated_1_2
      }

      const bilas_p3 = {
        mesin: state_mesin_bilas_p3
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



    let mesin = {
      regang_int: {
        mesin: data14.state_mesin_regang_int,
        coupling: data14.state_coupling_regang_int,
        counter1: 0
      },
      mal_int_1: {
        mesin: data14.state_mesin_mal_int_1,
        coupling: data14.state_coupling_mal_int_1,
        counter1: 0
      },
      mal_int_2: {
        mesin: data14.state_mesin_mal_int_2,
        coupling: data14.state_coupling_mal_int_2,
        counter1: 0
      },
      bubut_pinggir_1: {
        mesin: data14.state_mesin_bubut_int,
        coupling: data14.state_coupling_bubut_int_1,
        counter1: 0,
        counter2: 0
      },
      bubut_pinggir_2: {
        mesin: data14.state_mesin_bubut_int,
        coupling: data14.state_coupling_bubut_int_2,
        counter1: 0,
        counter2: 0
      },
      cuci_bilas: {
        mesin: data28.state_mesin_cuci_bilas
      },
      oven: {
        mesin: data28.state_mesin_oven
      },
      cuci_asam: {
        mesin: data28.state_mesin_cuci_asam
      },
      botol_integrated: {
        mesin: data28.state_mesin_botol_integrated,
        coupling: data28.state_coupling_botol_integrated,
        counter1: 0,
        counter2: 0
      },
      bor_integrated: {
        mesin: data28.state_mesin_bor_integrated,
        coupling: data28.state_coupling_bor_integrated,
        counter1: 0,
        counter2: 0
      },
      bilas_p3: {
        mesin: data28.state_mesin_bilas_p3
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