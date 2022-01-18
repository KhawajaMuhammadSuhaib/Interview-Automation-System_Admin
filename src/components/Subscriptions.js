import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { CustomerService } from '../service/CustomerService';
import UserContext from '../Context/User';

export const Subscriptions = () => {
    const { user, setUser } = useContext(UserContext)
    const [customer1, setCustomer1] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [loading1, setLoading1] = useState(true);

    useEffect(() => {
        const customerService = new CustomerService();
        customerService.getSubscriptions(user.token).then(data => { setCustomer1(data); setLoading1(false) });

    }, []);
    const customer1TableHeader = (
        <div className="table-header">
            All Checkouts
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
                {data.userID.name}
            </>
        );
    };

    const StartDateBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Start Date</span>
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.periodStart}</span>
            </>
        );
    };
    const EndDateBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">End Date</span>
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.periodEnd}</span>
            </>
        );
    };


    const EmailBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.userID.email}</span>
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {data.status === 'active' ?
                    <span className={`customer-badge status-qualified`}>{data.status}</span>
                    :
                    <span className={`customer-badge status-unqualified`}>{data.status}</span>
                }

            </>
        )
    };

    const actionTemplate = () => <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>;

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <DataTable value={customer1} paginator className="p-datatable-customers" rows={10} dataKey="id" rowHover
                        globalFilter={globalFilter1} emptyMessage="No customers found." loading={loading1} header={customer1TableHeader}>
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                        <Column field="email" header="Email" sortable body={EmailBodyTemplate}></Column>
                        <Column field="date" header="Start Date" sortable body={StartDateBodyTemplate}></Column>
                        <Column field="date" header="End Date" sortable body={EndDateBodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', justifyContent: 'center' }} body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>

        </div>
    )
}
