import React, { useState, useEffect, useContext, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { CustomerService } from '../service/CustomerService';
import UserContext from '../Context/User';
import { Dialog } from 'primereact/dialog'; 
import '../StyleSheets/web.css'

export const Complaints = () => {
    const { user } = useContext(UserContext)
    const [customer1, setCustomer1] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [loading1, setLoading1] = useState(true);
    const [position, setPosition] = useState('center');
    const [values, setValues] = useState(null)
    const customerService = new CustomerService();

    useEffect(() => {
        customerService.getComplains(user.token).then(data => { setCustomer1(data); setLoading1(false) });

    }, [displayBasic]);
    const customer1TableHeader = (
        <div className="table-header">
            All Complaints
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter1} onChange={(e) => setGlobalFilter1(e.target.value)} placeholder="Search" />
            </span>
        </div>
    );

    const bodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                <span className='customer-badge' >{data.title}</span>
            </>
        );
    };

    const UserBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">user</span>
                <span className='customer-badge' >{data.userID.name}</span>
            </>
        );
    };
    const UserTypeBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                <span >{data.userID.userType}</span>
            </>
        );
    };
    const DateBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <span >{(data.createdAt).slice(0, 10)}</span>
            </>
        );
    };
    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${data.status}`}>{data.status}</span>
            </>
        )
    };
    const onHide = () => {
        setDisplayBasic(false)
    }

    const renderFooter = () => {
        const markAsDone = () => {
            const ID = values._id
            customerService.complainDoneStatus(user.token, ID).then(data => {
                console.log(data);
                setDisplayBasic(false)
            }).catch(err=>{setDisplayBasic(false);console.log(err)})

        }
        const markAsWorking = () => {
            const ID = values._id
            customerService.complainWorkingStatus(user.token, ID).then(data => {
                console.log(data);
                setDisplayBasic(false)
            }).catch(err=>{setDisplayBasic(false);console.log(err)})

        }
        return (
            <div>
                <Button label="Mark as done" icon="pi pi-check" style={{background:'#22d62e',border:'none'}}  onClick={() => markAsDone()} />
                <Button label="Mark as working" icon="pi pi-clock" style={{background:'#d69049',border:'none'}}  onClick={() => markAsWorking()} />
                <Button label="Cancel" icon="pi pi-times" style={{border:'none'}} onClick={() => onHide()}  />
            </div>
        );
    }
    const actionTemplate = (data) => {
        const onClick = (position) => {
            setDisplayBasic(true)
            setValues(() => data)
            if (position) {
                setPosition(position);
            }
        }
        return (
            <>
                <Button type="button" icon="pi pi-search" className="p-button-secondary" style={{background:'#47bff7',border:'none'}} onClick={() => onClick()}></Button>
                <Dialog header='Complaint Information' visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter()} onHide={() => onHide()}>
                    <p className='header'>{values?.title}</p>
                    <p className='subheadings'> <b>Complaintant : </b>{values?.userID?.name}</p>
                    <p className='subheadings'><b>Type : </b>{values?.userID?.userType}</p>
                    <p className='subheadings'><b>Status : </b>{values?.status}</p>
                    <p className='subheadings red'><b>Date : </b>{(values?.createdAt)?.slice(0, 10)}</p>
                    <b style={{ color: 'black', fontSize: '16px', }}>Description : </b>
                    <p className='description'>{values?.description}</p>

                </Dialog>
            </>
        )
    }

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <DataTable value={customer1} paginator className="p-datatable-customers" rows={10} dataKey="id" rowHover
                        globalFilter={globalFilter1} emptyMessage="No customers found." loading={loading1} header={customer1TableHeader}>
                        <Column field="name" header="Subject" sortable body={bodyTemplate}></Column>
                        <Column field="representative.name" header="User" sortable body={UserBodyTemplate}></Column>
                        <Column field="representative.name" header="UserType" sortable body={UserTypeBodyTemplate}></Column>
                        <Column field="date" header="Date" sortable body={DateBodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', justifyContent: 'center' }} body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>

        </div>
    )
}
