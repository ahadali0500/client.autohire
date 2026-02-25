import Root from '@/components/layout/Root'
import React from 'react'

export default function layout({ children }: any) {
    return (
        <div>
            <Root>
                {children}
            </Root>
        </div>
    )
}
