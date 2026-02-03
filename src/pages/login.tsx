import Button from "@/components/Button";

export default function Login() {
    return (
        <>
        <h1>Test</h1>
            <Button label={"Login"} type={"primary"} height={5} width={15}/>
            <br/>
            <Button label={"test"} type={"accent"} height={5} width={10}/>
            <Button label={"test"} type={"success"} height={5} width={10}/>
            <Button label={"test"} type={"error"} height={5} width={10}/>
        </>
    );
}
