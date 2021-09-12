import React, {useContext, useState} from 'react'
import {Context} from "../core/Store";
import {PAGE_STATES} from "../core/EditorFlow";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import StyledRadioButtonGroup from "../component-styled/StyledRadioButtonGroup";
import {DataGrid} from "@mui/x-data-grid";

export function SharingEditor() {
    const [state, dispatch] = useContext(Context);
    const {pageState, shareDataExtended} = state;
    const [email, setEmail] = useState('test1@mapboard.io');
    const [access, setAccess] = useState('view')

    const typeEmail = (e) =>        setEmail(e.target.value)
    const closeSharingEditor = _ => dispatch({type: 'CLOSE_SHARING_EDITOR'})
    const createShare = _=>       dispatch({type: 'CREATE_SHARE', payload: {email, access}})

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params) =>
                `${params.getValue(params.id, 'firstName') || ''} ${
                    params.getValue(params.id, 'lastName') || ''
                }`,
        },
    ];

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];


    // const [dataGridRows, setDataGridRows] = useState([])
    //
    // const dataGridColumns = [
    //     { field: 'avatar', headerName: ' ', width: 150, renderCell: (params) => (
    //             <AccountCircleIcon/>
    //         )},
    //     { field: 'name', headerName: 'NAME', width: 200 },
    //     { field: 'sex', headerName: 'SEX', width: 100 },
    //     { field: 'placeAndDateOfBirth', headerName: 'PLACE AND DATE OF BIRTH', width: 300},
    //     { field: 'groups', headerName: 'GROUPS', width: 300},
    //     { field: 'action', headerName: ' ', renderCell: (params) => (
    //             <strong>
    //                 <IconButton aria-label="edit" size="small" onClick={_=>{}}>
    //                     <EditIcon />
    //                 </IconButton>
    //                 <IconButton aria-label="delete" size="small" onClick={_=>{}}>
    //                     <DeleteIcon />
    //                 </IconButton>
    //             </strong>
    //         ),
    //     }
    // ]

    return(
        <Modal
            open={pageState === PAGE_STATES.WORKSPACE_SHARING}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {<div style={{
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%)',
                top: 96,
                width: 48*16,
                height: 800,
                flexDirection: 'column',
                alignItems: 'center',
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: 16,
                backgroundColor: '#fbfafc',
                padding: 20,
                border: "1px solid #fbfafc",
                borderRadius: '16px'
            }}>
                <Typography component="h1" variant="h5">Sharing</Typography>

                <StyledInput open={true} label="Email" value={email} action={typeEmail}/>

                <StyledRadioButtonGroup open={true} valueList={['view', 'edit']} value={access} action={e=>setAccess(e.target.value)}/>

                <StyledButton version="longContained" disabled={false} action={createShare} name={'share'}/>

                <StyledButton version={'shortOutlined'} name={'close without sharing'} action={closeSharingEditor}/>

                <div>
                    {JSON.stringify(shareDataExtended)}


                </div>

                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                    />

                </div>

                {/*<div style={{ height: 400, width: '100%' }}>*/}

                {/*</div>*/}


                {/*<DataGrid*/}
                {/*    rows={dataGridRows}*/}
                {/*    columns={dataGridColumns}*/}
                {/*    disableSelectionOnClick={true}*/}
                {/*    disableColumnMenu={true}*/}
                {/*    pageSize={10}*/}
                {/*    checkboxSelection />*/}


            </div>}
        </Modal>
    )
}
