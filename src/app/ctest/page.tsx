'use client'

import Button from "@/components/layout/Button";
import { useSidepane } from "@/contexts/SidepaneContext";

export default function Ctest() {

    const { showSidepane, hideSidepane } = useSidepane();

    return (
        <>
            <h1>Test</h1>
            <Button label={"Page"} type={"primary"} height={3} width={15} onClick={() => alert("Page")}/>
            <br/>
            <Button label={"test"} type={"accent"} height={5} width={10}/>
            <Button label={"test"} type={"success"} height={5} width={10}/>
            <Button label={<h1 style={{color: '#000'}}> Test</h1>} type={"error"} height={5} width={10}/>
            <br/>
            <Button label={"Open Sidepane"} type={"primary"} height={3} width={15}
                    onClick={() =>
                        showSidepane(
                            <div>
                                Ich bin ein Content!
                            </div>
                        )
                    }/>
            <br/>

        </>
)
    ;
}
