import React, { useState, useEffect, useContext } from 'react';
// import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '../service/CustomerService';
import { Dialog } from 'primereact/dialog';
import '../StyleSheets/web.css'
import UserContext from '../Context/User';

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: .4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 150],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: .4
        }
    ]
};

export const Dashboard = () => {
    const { user } = useContext(UserContext)
    const [company, setCompany] = useState(null);
    const [applicant, setApplicant] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [jobs, setJobs] = useState(null);
    const [complian, setCompalain] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    const [loading4, setLoading4] = useState(true);
    const [loading5, setLoading5] = useState(true);
    const [loading6, setLoading6] = useState(false)
    const [position, setPosition] = useState('center');
    const [values, setValues] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const services = new CustomerService();

    // const menu2 = useRef(null);

    useEffect(() => {
        services.getCompanies(user.token).then(data => { setCompany(data); setLoading1(false) });
        services.getApplicants(user.token).then(data => { setApplicant(data); setLoading2(false) })
        services.getAllJobs(user.token).then(data => { setJobs(data); setLoading3(false) })
        services.getSubscriptions(user.token).then(data => { setSubscription(data); setLoading4(false) });
        services.getComplains(user.token).then(data => { setCompalain(data); setLoading5(false) });
        services.getTotalSales(user.token).then(data => { console.log(data) });
    }, [displayBasic,loading6]);

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
    const deleteJob = (data) => {
        setLoading6(true)
        const ID = data._id
        services.deleteJob(user.token, ID).then(data => {
            console.log(data);
            setLoading6(false)
        }).catch(err => { console.log(err); setLoading6(false) })

    }
    const renderFooter = () => {
        const markAsDone = () => {
            const ID = values._id
            services.complainDoneStatus(user.token, ID).then(data => {
                console.log(data);
                setDisplayBasic(false)
            }).catch(err => { setDisplayBasic(false); console.log(err) })

        }
        const markAsWorking = () => {
            const ID = values._id
            services.complainWorkingStatus(user.token, ID).then(data => {
                console.log(data);
                setDisplayBasic(false)
            }).catch(err => { setDisplayBasic(false); console.log(err) })

        }
        return (
            <div>
                <Button label="Mark as done" icon="pi pi-check" style={{ background: '#22d62e', border: 'none' }} onClick={() => markAsDone()} />
                <Button label="Mark as working" icon="pi pi-clock" style={{ background: '#d69049', border: 'none' }} onClick={() => markAsWorking()} />
                <Button label="Cancel" icon="pi pi-times" style={{ border: 'none' }} onClick={() => onHide()} />
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
                <Button type="button" icon="pi pi-search" className="p-button-secondary" style={{ background: '#47bff7', border: 'none' }} onClick={() => onClick()}></Button>
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
        <div className="grid">

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Companies</span>
                            {
                                loading1 ?
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
                                    :
                                    <div className="text-900 font-medium text-xl">{company.length}</div>
                            }

                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">5 </span>
                    <span className="text-500">since last week</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Applicants</span>
                            {
                                loading2 ?
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
                                    :
                                    <div className="text-900 font-medium text-xl">{applicant.length}</div>
                            }
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">520  </span>
                    <span className="text-500">newly registered</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Jobs</span>
                            {
                                loading3 ?
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
                                    :
                                    <div className="text-900 font-medium text-xl">{jobs.length}</div>
                            }
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-briefcase text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 new</span>
                    <span className="text-500"></span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Subscriptions</span>
                            {
                                loading4 ?
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
                                    :
                                    <div className="text-900 font-medium text-xl">{subscription.length}</div>
                            }
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">24 new </span>
                    <span className="text-500">since last visit</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Jobs</h5>
                    <DataTable value={jobs} loading={loading3} className="p-datatable-customers" rows={5} paginator>
                        <Column field="name" header="Job title" sortable body={(data) => data.title} />
                        <Column field="price" header="Company" sortable body={(data) => data.company?.name} />
                        <Column body={(data) => (
                            <>
                                <Button
                                    loading={loading6}
                                    type="button"
                                    icon="pi pi-trash"
                                    className="p-button-secondary"
                                    style={{ background: 'rgb(224, 43, 43)', border: 'none' }}
                                    onClick={() => deleteJob(data)}
                                ></Button>

                            </>
                        )} />
                    </DataTable>
                </div>
                <div className="card">
                    <h5>Complains</h5>
                    <DataTable value={complian} loading={loading5} className="p-datatable-customers" rows={5} paginator>
                        <Column field="name" header="Title" sortable body={(data) => data.title} />
                        <Column field="price" header="User" body={(data) => data.userID.name} />
                        <Column field="price" header="Status" body={statusBodyTemplate} />
                        <Column body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} />
                </div>

                {/* <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu2.current.toggle(event)} />
                            <Menu ref={menu2} popup model={[{ label: 'Add New', icon: 'pi pi-fw pi-plus' }, { label: 'Remove', icon: 'pi pi-fw pi-minus' }]} />
                        </div>
                    </div>

                    <span className="block text-600 font-medium mb-3">TODAY</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">Richard Jones
                                <span className="text-700"> has purchased a blue t-shirt for <span className="text-blue-500">79$</span></span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-download text-xl text-orange-500" />
                            </div>
                            <span className="text-700 line-height-3">Your request for withdrawal of <span className="text-blue-500 font-medium">2500$</span> has been initiated.</span>
                        </li>
                    </ul>

                    <span className="block text-600 font-medium mb-3">YESTERDAY</span>
                    <ul className="p-0 m-0 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">Keyser Wick
                                <span className="text-700"> has purchased a black jacket for <span className="text-blue-500">59$</span></span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-question text-xl text-pink-500" />
                            </div>
                            <span className="text-900 line-height-3">Jane Davis
                                <span className="text-700"> has posted a new questions about your product.</span>
                            </span>
                        </li>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}
