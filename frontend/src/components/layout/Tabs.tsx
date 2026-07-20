'use client';

import * as React from 'react';
import styles from './Tabs.module.css';
import Card from "@/components/layout/Card";

interface TabsProps {
    tabs: Record<string, React.ReactNode>;
}

export default function Tabs({tabs}: TabsProps) {

    const [activeTab, setActiveTab] = React.useState<string>(
        Object.keys(tabs)[0]
    );

    function switchTab(tabName: string) {
        setActiveTab(tabName);

    }

    return (
        <>
            <Card className={styles.tabbox} shadow={false}>
                {Object.entries(tabs).map(([name]) => (
                    <Card
                        key={name}
                        onClick={() => switchTab(name)}
                        className={`${styles.tabboxButtons} ${activeTab === name ? styles.selectedTab : ""}`}
                        shadow={false}
                    >
                        {name}
                    </Card>
                ))}
            </Card>

            <div className={styles.content}>
                {tabs[activeTab]}
            </div>
        </>
    );
}
