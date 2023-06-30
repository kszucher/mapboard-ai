import React, {FC} from "react";
import {useDispatch} from "react-redux";
import {actions, AppDispatch} from "../core/EditorReducer";

export const Hero: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <a href="#"
           className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
           role="alert">
          <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
            New
          </span>
          <span className="text-sm font-medium">
            MapBoard v0.1 Alpha is out! Join our elite group of early testers!
          </span>
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"></path>
          </svg>
        </a>
        <div>
          <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                <div className="">
                  <h1 className="flex justify-center">Turn Your Data Into</h1>
                  <h1 className="rotate-wrap leading-normal flex justify-center ">
                    <span> &nbsp;</span>
                    <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Roadmaps</span>
                    <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r to-teal-600 from-green-400">Actionable Insights</span>
                    <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r to-orange-600 from-amber-400">Step-by-Step Plans</span>
                    <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r to-sky-600 from-indigo-400">Detailed Forecasts</span>
                  </h1>
                  <h1 className="flex justify-center">Visually</h1>
                </div>
              </h1>
              <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
                We craft AI-powered visual workflows,
                <br/>
                unlocking new dimensions of knowledge-driven team collaboration.
              </p>





              {/*<br></br>*/}
              {/*<br></br>*/}
              {/*<section className="bg-white dark:bg-gray-900">*/}
              {/*  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">*/}
              {/*    <div className="mx-auto max-w-screen-md sm:text-center">*/}
              {/*      <form action="#">*/}
              {/*        <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">*/}
              {/*          <div className="relative w-full">*/}
              {/*            <label htmlFor="email"*/}
              {/*                   className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email*/}
              {/*              address</label>*/}
              {/*            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">*/}
              {/*              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"*/}
              {/*                   viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
              {/*                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>*/}
              {/*                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>*/}
              {/*              </svg>*/}
              {/*            </div>*/}
              {/*            <input*/}
              {/*              className="block p-3 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"*/}
              {/*              placeholder="Enter your email"*/}
              {/*              type="email"*/}
              {/*              id="email"*/}
              {/*              required/>*/}
              {/*          </div>*/}
              {/*          <div>*/}
              {/*            <button*/}
              {/*              type="submit"*/}
              {/*              className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">*/}
              {/*              Subscribe*/}
              {/*            </button>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div*/}
              {/*          className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">*/}
              {/*          We care about the protection of your data*/}
              {/*          <a href="#" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">*/}
              {/*            Read our Privacy Policy</a>.*/}
              {/*        </div>*/}
              {/*      </form>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</section>*/}

              <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <a href="#"
                   className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                  Learn more
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#"
                   className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                  <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                  </svg>
                  Watch video
                </a>
              </div>

              <br/>

              <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img className="rounded-xl" src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81o4ierqrkzojD9lu5fvJWjgVaRqbfJfkJhjQyuZN8V7ZCbXCtSq2s3FstHw9s1n-LNOdK7Ct7LwGJcQUtlrc2Odiztp=w2559-h1315" alt="mockup" id="img"/>
              </div>


              <section className="bg-white dark:bg-gray-900">
                <div
                  className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                  <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                      Use Case: <br/>Transcribe Your Meetings
                    </h2>
                    <p className="mb-4">
                      Make a recording of your meeting notes, upload the transcript to MapBoard, and extract all the information you need,
                      visually and automatically.
                    </p>
                    <a href="#"
                       className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                      <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                      </svg>
                      Watch video
                    </a>
                  </div>
                  {/*<div className="gap-4 mt-8">*/}
                    {/*<img className="w-full rounded-lg"*/}
                    {/*     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"*/}
                    {/*     alt="office content 1">*/}
                    {/*  <img className="mt-4 w-full lg:mt-10 rounded-lg"*/}
                    {/*       src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"*/}
                    {/*       alt="office content 2">*/}


                    <div className="flex justify-center bg">
                      <iframe
                        src="https://drive.google.com/file/d/1ODp5-PvE9KePnvSIvGRpoxttrwbLQU37/preview" width="640" height="320" allow="autoplay"></iframe>
                    </div>


                  {/*</div>*/}
                </div>
              </section>






            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
