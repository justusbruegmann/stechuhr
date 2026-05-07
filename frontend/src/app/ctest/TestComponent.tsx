import {useCurrentModal} from "@/contexts/ModalContext";

function TestComponent() {
    const { close } = useCurrentModal();

    return (
        <div style={{ padding: '3rem' }}>
            <button onClick={close}>Close Modal</button>
            {/* your content */}
        </div>
    );
}

export default TestComponent;