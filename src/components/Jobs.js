import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { CustomerService } from '../service/CustomerService';
import UserContext from '../Context/User';
import { Dialog } from 'primereact/dialog';
import '../StyleSheets/web.css'

export const Jobs = () => {
    const { user } = useContext(UserContext)
    const [customer1, setCustomer1] = useState(null);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [loading1, setLoading1] = useState(true);
    const [position, setPosition] = useState('center');
    const [values, setValues] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const customerService = new CustomerService();
    const [loading2, setLoading2] = useState(false);


    useEffect(() => {
        customerService.getAllJobs(user.token).then(data => { setCustomer1(data); setLoading1(false) });

    }, [displayBasic]);
    const customer1TableHeader = (
        <div className="table-header">
            All Jobs
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
                <span className={`customer-badge`}>{data.title}</span>

            </>
        );
    };
    const CompanybodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data.company?.name}
            </>
        );
    };

    const DateBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{(data.createdAt).slice(0, 10)}</span>
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {
                    data.active ?
                        <span className={`customer-badge status-qualified`}>Active</span>
                        :
                        <span className={`customer-badge status-unqualified`}>Closed</span>
                }

            </>
        )
    };
    const onHide = () => {
        setDisplayBasic(false)
    }

    const renderFooter = () => {
        const deleteJob = () => {
            setLoading2(true)
            const ID = values._id
            customerService.deleteJob(user.token, ID).then(data => {
                console.log(data);
                setDisplayBasic(false);
                setLoading2(false);
            }).catch(err => { setDisplayBasic(false); console.log(err);setLoading2(false) })

        }
        return (
            <div>
                <Button loading={loading2} label="Delete" icon="pi pi-trash" style={{background:'#c63737',border:'none'}}  onClick={() => deleteJob()} />
                <Button label="Cancel" icon="pi pi-times" style={{border:'none'}} onClick={() => onHide()}  />
            </div>
        );
    }
    const actionTemplate = (data) => {
        const onClick = (position) => {
            console.log(data)
            setDisplayBasic(true)
            setValues(() => data)
            if (position) {
                setPosition(position);
            }
        }
        return (
            <>
                <Button type="button" icon="pi pi-search" className="p-button-secondary" style={{background:'#47bff7',border:'none'}} onClick={() => onClick()}></Button>
                <Dialog header='Job Information' visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter()} onHide={() => onHide()}>
                    <p className='header'>{values?.title}</p>
                    <p className='subheadings'> <b>Company : </b>{values?.company?.name}</p>
                    <p className='subheadings'><b>Location : </b>{values?.location}</p>
                    <p className='subheadings'><b>Type : </b>{values?.jobType}</p>
                    <p className='subheadings'><b>Experience : </b>{values?.experience}</p>
                    {
                        values?.active ?
                            <p className='subheadings '><b>Status : </b>ACTIVE</p>
                            :
                            <p className='subheadings '><b>Status : </b>CLOSED</p>
                    }
                    <p className='subheadings red'><b>Date : </b>{(values?.createdAt)?.slice(0, 10)}</p>
                    <b style={{ color: 'black', fontSize: '16px', }}>Description : </b>
                    <p className='description'>{values?.description}</p>
                    <b style={{ color: 'black', fontSize: '16px', }}>Requirement : </b>
                    <p className='description'>{values?.skills}</p>

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
                        <Column field="name" header="Job Title" sortable body={bodyTemplate}></Column>
                        <Column field="representative.name" header="Company Name" sortable body={CompanybodyTemplate}></Column>
                        <Column field="date" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column field="status" header="Date" sortable body={DateBodyTemplate}></Column>
                        <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', justifyContent: 'center' }} body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>

        </div>
    )
}
