'use client';

import Button from "@/components/layout/Button";
import {useModal} from "@/contexts/ModalContext";
import TestComponent from "@/app/ctest/TestComponent";
import { getAllRequestsAManagerIsResponsibleFor } from "@/scripts/requests";

//asd
export default function Ctest() {

    const {showModal} = useModal();

    async function a(){
        const request = await getAllRequestsAManagerIsResponsibleFor();
        console.log(request);
    }

    return (
        <>
            <h1>Test</h1>
            <Button label={"Page"} type={"primary"} height={3} width={15} onClick={() => alert("Page")}/>
            <br/>
            <Button label={"test"} type={"accent"} height={5} width={10}/>
            <Button label={"test"} type={"success"} height={5} width={10}/>
            <Button label={"test"} type={"success"} height={5} width={10} loading={true}/>
            <Button label={<h1 style={{color: '#000'}}> Test</h1>} type={"error"} height={5} width={10}/>
            <br/>

            <Button label={"Open empty sidepane"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showModal("sidepane",
                            <TestComponent/>
                        )
                    }/>
            <br/>

            <Button label={"Open Popup"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showModal("popup",
                            <TestComponent/>
                        )
                    }/>
            <br/>

            <Button label={"Show Loading Spinner"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showModal("spinningLoader", <p>Logging in</p>)
                    }/>
            <br/>
            
            <Button label={"Get requests a manager is responsible for"} type="primary" height={3} width={15} onClick={() => a()}/>
        </>
    )
        ;
}
