'use client';

import Button from "@/components/layout/Button";
import { useModal } from "@/contexts/ModalContext";
import Overview from "@/components/overview/Overview";


export default function Ctest() {

    const { showModal } = useModal();

    return (
        <>
            <h1>Test</h1>
            <Button label={"Page"} type={"primary"} height={3} width={15} onClick={() => alert("Page")}/>
            <br/>
            <Button label={"test"} type={"accent"} height={5} width={10}/>
            <Button label={"test"} type={"success"} height={5} width={10}/>
            <Button label={<h1 style={{color: '#000'}}> Test</h1>} type={"error"} height={5} width={10}/>
            <br/>
            <Button label={"Overview"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showModal("sidepane",
                            <Overview />
                        )
                    }/>
            <br/>

            <Button label={"Open empty sidepane"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showModal("sidepane",
                            <></>
                        )
                    }/>
            <br/>

            <Button label={"Open Popup"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showModal("popup",
                            <div>
                                Ich bin ein Popup Content!
                            </div>
                        )
                    }/>
            <br/>

        </>
)
    ;
}
