import React from 'react'

const MainLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='container mx-auto mt-24 mb-20 px-5'>{children}</div>
    )
}

export default MainLayout