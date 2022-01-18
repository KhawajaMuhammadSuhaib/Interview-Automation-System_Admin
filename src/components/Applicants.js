import React, { useState, useEffect, useContext, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { CustomerService } from '../service/CustomerService';
import { Toast } from 'primereact/toast';
import UserContext from '../Context/User';

export const Applicants = () => {
    const { user } = useContext(UserContext)
    const [customer1, setCustomer1] = useState(null);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [loading1, setLoading1] = useState(true);
    const customerService = new CustomerService();
    const [loading2, setLoading2] = useState(false);
    const toastBR = useRef(null);
    const showBlock = () => {
        toastBR.current.show({ severity: 'success', summary: 'Success', detail: 'User blocked Successfully', life: 3000 });
    }
    const showUnblock = () => {
        toastBR.current.show({ severity: 'success', summary: 'Success', detail: 'User Unblocked Successfully', life: 3000 });
    }

    useEffect(() => {
        customerService.getApplicants(user.token).then(data => { setCustomer1(data); setLoading1(false) });

    }, [loading2]);
    const customer1TableHeader = (
        <div className="table-header">
            List of Applicants
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
                <span className="customer-badge">{data.userID.name}</span>
            </>
        );
    };

    const EmailBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                <span >{data.userID.email}</span>
            </>
        );
    };
    const TitleBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Title</span>
                <span className="customer-badge status-proposal">{data.title}</span>
            </>
        );
    }; const GenderBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                <span >{data.gender}</span>
            </>
        );
    }; const DatebodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <span >{(data.createdAt).slice(0, 10)}</span>
            </>
        );
    };


    const actionTemplate = (data) => {
        const BlockUser = () => {
            setLoading2(true)
            const id = data.userID?._id
            customerService.blockUser(user.token, id).then(data => { console.log(data); showBlock(); setLoading2(false) });
        }
        const UnblockUser = () => {
            setLoading2(true)
            const id = data.userID._id;
            customerService.unblockUser(user.token, id).then(data => { console.log(data); showUnblock(); setLoading2(false) })
        }
        if (data.userID?.blocked) {
            return (
                <Button type="button"
                    icon="pi pi-check-circle"
                    className="p-button-secondary"
                    style={{ background: '#40b448', border: 'none' }}
                    onClick={UnblockUser}
                ></Button>
            )
        }
        else {
            return (
                <Button type="button" icon="pi pi-ban" className="p-button-secondary" style={{ background: 'rgb(224, 43, 43)', border: 'none' }} onClick={BlockUser} ></Button>
            )

        }
    }


    return (
        <div className="grid table-demo">
            <Toast ref={toastBR} position="bottom-right" />
            <div className="col-12">
                <div className="card">
                    <DataTable value={customer1} paginator className="p-datatable-customers" rows={10} dataKey="id" rowHover
                        globalFilter={globalFilter1} emptyMessage="No customers found." loading={loading1} header={customer1TableHeader}>
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                        <Column field="email" header="Email" sortable body={EmailBodyTemplate}></Column>
                        <Column field="title" header="Title" sortable body={TitleBodyTemplate}></Column>
                        <Column field="gender" header="Gender" sortable body={GenderBodyTemplate}></Column>
                        <Column field="date" header="Date" sortable body={DatebodyTemplate}></Column>
                        <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', justifyContent: 'center' }} body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>

        </div>
    )
}
