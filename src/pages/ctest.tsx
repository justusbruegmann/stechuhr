import Button from "@/components/Button";

export default function Ctest() {
    return (
        <>
            <h1>Test</h1>
            <Button label={"Login"} type={"primary"} height={3} width={15} onClick={() => alert("Login")}/>
            <br/>
            <Button label={"test"} type={"accent"} height={5} width={10}/>
            <Button label={"test"} type={"success"} height={5} width={10}/>
            <Button label={<h1 style={{ color: '#000' }}> Test</h1>} type={"error"} height={5} width={10}/>
        </>
    );
}
