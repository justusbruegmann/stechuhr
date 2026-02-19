import styles from "./not-found.module.css";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/layout/Card";

export default function NotFound() {
    return (

        <div className={`${styles["container"]}`}>
            <Card height={"20vh"} width={"15vw"} styleOverrides={{justifyContent: "center"}}>
                <div className={`${styles["not-found-center"]}`}>
                    <h1 className={`${styles["not-found-title"]}`}>404</h1>
                    <Image
                        src={`${process.env.BASE_PATH}/error_icon.svg`}
                        alt="Page not found icon"
                        width={48}
                        height={48}
                        style={{filter: 'invert()'}}
                        priority
                    />
                    <p className={`${styles["not-found-content"]}`}>Page not found</p>
                    <p className={`${styles["not-found-content"]}`}>
                        <Link className={`${styles["not-found-link"]}`}
                              href={"/"}> Go to Main page</Link>
                    </p>

                </div>
            </Card>
        </div>

    );
}
