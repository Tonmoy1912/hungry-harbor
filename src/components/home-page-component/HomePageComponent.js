"use client";
import React, { Fragment } from "react";
// import  {Typed}  from "react-typed";
import Typewriter from 'typewriter-effect';

export function TypingText() {
    return (
        <Fragment>
            <div className="text-transparent text-4xl font-bold bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 py-2">
                <Typewriter
                    options={{
                        strings: ['Browse Items', 'Place Orders', 'Track Orders in Realtime','Give Reviews'],
                        autoStart: true,
                        loop: true,
                    }}
                />
            </div>
        </Fragment>
    )
}