import { Delete, Edit, VideoCall } from "@mui/icons-material"
import {
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material"
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import CustomNoDataOverlay from "../../components/gridComponents/CustomNoDataOverlay"
import CreateNewAppointment from "../../components/appointment/CreateNewAppointment"
import mick from "../../api/Scheduler"
import DoctorProfile from "../../components/appointment/DoctorProfile"
import { useSnackbar } from "./Patient"
import { useNavigate } from "react-router-dom"
import useToken from "../../hooks/useToken"
import { DateTime } from "luxon"
import axios from "axios"
import Config from "../../api/Config"
import { DoctorName } from "./HomeAppointment"

const distractAppt = (data) => {
  if (Array.isArray(data)) {
    return data.map((e) => {
      let { date, start_time, end_time } = e.appt_date
      return {
        id: e.id,
        doctor: e.doctor,
        date,
        start_time,
        end_time,
      }
    })
  }
  let { date, start_time, end_time } = data.appt_date
  return {
    id: data.id,
    doctor: data.doctor,
    date,
    start_time,
    end_time,
  }
}

const Appointment = () => {
  const nav = useNavigate()
  const [data, setData] = useState({ rows: [], loading: true })
  const [profile, setProfile] = useState({ open: false })
  const [deleteAppointment, setDeleteAppointment] = useState({ open: false })
  const { setSnackbar } = useSnackbar()
  const { token } = useToken()

  useEffect(() => {
    mick
      .get(`/patient/${token.userId}/appt/`)
      .then(({ data }) => {
        setData({ rows: distractAppt(data), loading: false })
      })
      .catch(({ message }) => {
        setSnackbar({
          open: true,
          children: "Error: " + message,
          severity: "error",
        })
      })
  }, [])

  const handleEdit = (row) => {
    setProfile({
      open: true,
      ...row,
    })
  }

  const editRow = (row, dateValue) => {
    mick
      .put(`/patient/${token.userId}/appt/${row.id}/`, {
        id: row.id,
        doctor: row.doctor,
        appt_date: {
          date: DateTime.fromISO(dateValue.date).toISODate(),
          start_time: DateTime.fromISO(dateValue.start).toISOTime(),
          end_time: DateTime.fromISO(dateValue.end).toISOTime(),
        },
        temp: token.userId,
      })
      .then(({ data }) => {
        setProfile({ open: false })
        setData((e) => {
          let x = {
            ...row,
            date: data.appt_date.date,
            start_time: data.appt_date.start_time,
            end_time: data.appt_date.end_time,
          }
          let newData = e.rows.filter((z) => z.id !== x.id)
          console.log(e, x)
          return { loading: false, rows: [...newData, x] }
        })
        setSnackbar({ open: true, children: "Successfull operation" })
      })
      .catch(({ message }) => {
        setProfile({ open: false })
        setSnackbar({
          open: true,
          children: "Error: " + message,
          severity: "error",
        })
      })
  }

  const handleDelete = () => {
    setDeleteAppointment({ ...deleteAppointment, open: false })
    setData({ ...data, loading: true })
    mick
      .delete(`/patient/${token.userId}/appt/${deleteAppointment.row.id}/`)
      .then(() => {
        let newData = data.rows.filter((e) => e.id !== deleteAppointment.row.id)
        setData({ rows: newData, loading: false })
      })
      .catch(({ message }) => {
        setData({ ...data, loading: false })
        setSnackbar({
          open: true,
          children: "Could't cancel appt: " + message,
          severity: "error",
        })
      })
  }

  const getRoom = (row) => {
    setSnackbar({ open: true, children: "please wait." })
    axios
      .get(`${Config.USER_URL}/id/${row.doctor}`)
      .then(({ data }) => {
        nav("/user/patient/room/" + data.user.email)
      })
      .catch(({ message }) => {
        setSnackbar({
          open: true,
          children: "Could't fetch user info: " + message,
          severity: "error",
        })
      })
  }

  const column = [
    {
      field: "doctor",
      headerName: "Doctor",
      flex: 1,
      renderCell: ({ value }) => <DoctorName id={value} />,
    },
    {
      field: "date",
      headerName: "Date",
      type: "dateTime",
      flex: 1,
      valueGetter: ({ value }) => {
        return DateTime.fromISO(value).toLocaleString(DateTime.DATE_MED)
      },
    },
    {
      field: "start_time",
      headerName: "Start Time",
      flex: 1,
      valueGetter: ({ value }) => {
        return DateTime.fromISO(value).toLocaleString(DateTime.TIME_SIMPLE)
      },
    },
    {
      field: "end_time",
      headerName: "End Time",
      flex: 1,
      valueGetter: ({ value }) => {
        return DateTime.fromISO(value).toLocaleString(DateTime.TIME_SIMPLE)
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<Edit color="secondary" />}
            label={"Edit"}
            onClick={() => handleEdit(row)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label={"Delete"}
            onClick={() => setDeleteAppointment({ open: true, row })}
          />,
          <GridActionsCellItem
            label={"Go to Room"}
            showInMenu
            icon={<VideoCall />}
            onClick={() => getRoom(row)}
          />,
        ]
      },
    },
  ]

  return (
    <>
      <br />
      <Typography color="primary" variant="h4" sx={{ mb: "20px" }}>
        Appointments
      </Typography>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          rowHeight={100}
          rows={data.rows}
          columns={column}
          hideFooterPagination
          hideFooterSelectedRowCount
          components={{
            NoRowsOverlay: CustomNoDataOverlay,
            Footer: CreateNewAppointment,
          }}
          loading={data.loading}
        />
      </div>
      {profile.open && (
        <DoctorProfile
          {...profile}
          handleClose={() => setProfile({ open: false })}
          apply={editRow}
        />
      )}
      {deleteAppointment.open && (
        <Dialog open onClose={() => setDeleteAppointment({ open: false })}>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cance your schedule
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleDelete}>
              Yes
            </Button>
            <Button
              color="success"
              onClick={() => setDeleteAppointment({ open: false })}
            >
              no
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
export default Appointment
