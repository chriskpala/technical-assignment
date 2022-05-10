// import * as THREE from 'three';

import type { NextPage } from 'next'
import Image from "next/image";
import solana from "../assets/solana.png"
import browser from "../assets/browser.svg"
import twitter from "../assets/twitter.svg"
import paper from "../assets/paper.svg"
import { Canvas } from '@react-three/fiber';
import AppChart from '../components/AppChart';


// const scene = new THREE.Scene();
const Home: NextPage = () => {
    const data = [
        100 * 0.2,
        100 * 0.6,
        100 * -0.2,
        100 * 0,
        100 * 0.3,
        100 * 0,
        100 * 0.6,
        100 * -0.6,
        100 * -0.2,
        100 * 0.4,
        100 * 0.2,
        100 * -0.7,
        100 * -0.5,
        100 * -0.8,
        100 * 0.1,
        100 * 0.3,
        100 * -0.2,
        100 * 0.7,
        100 * 1,
        100 * 0.4,
        100 * 1.2,
    ];
  return (
    <div>
    <div className='font-["Lato"] flex justify-center'>
        <div className="w-[673px] h-[528px] mt-[200px] border rounded-lg flex flex-col">
            <div className="w-[100%] p-[31px] flex justify-around items-center">
                <div>
                    <Image src={solana} alt="solana-pic" />
                </div>
                <div className="w-[85%] h-[95%]">
                    <div className="flex justify-between w-[100%] items-center text-[24px] leading-8 ">
                        <div>
                            <span className="font-[600] mr-[5px]">
                                Solana
                            </span>
                            <span className="font-[600] text-[#BFBFBF]">
                                (SOL)
                            </span>
                        </div>
                        <div>
                            <p className="font-[700] item-left">
                                $104.14
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-[5px]">
                        <div className="flex text-[14px] leading-4 text-[#9B9B9B] font-[500] text-center">
                            <Image src={browser} alt="browser-pic" />
                            <p className="ml-[5px] mr-[8px] ">
                                solana.com
                            </p>
                            <Image src={twitter} alt="twitter-pic" />
                            <p className="ml-[4px] mr-[8px] ">
                                @solana
                            </p>
                            <Image src={paper} alt="paper-pic" />
                            <p className="ml-[5px] ">Whitepaper</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-[500] leading-3 item-center text-[#00BA34] tracking-normal">
                                +9.4%
                            </p>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
            <Canvas className="w-[100%] h-[100%]" orthographic>
                {/* <CurvedChartLine initialPoints={initialPoints} color={0x3D4860}></CurvedChartLine> */}
                <AppChart initialPoints={data} />
            </Canvas>
            <div className='flex justify-between font-inter  mt-[8px]  text-gray-500'>
                <p className="px-[8px]">Jan</p>
                <p className="px-[8px]">Mar</p>
                <p className="px-[8px]">May</p>
                <p className="px-[8px]">Jul</p>
                <p className="px-[8px]">Sep</p>
                <p className="px-[8px]">Nov</p>
                <p className="px-[8px]">Dec</p>
            </div>
            <div className="flex justify-end items-end font-inter mt-[28px] text-gray-300">
                <p className="m-[12px]">Coingecko</p>
            </div>
        </div>
    </div>
</div>
  )
}

export default Home
