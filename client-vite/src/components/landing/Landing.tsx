import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {FC, useEffect, useState} from "react"
import {useAuth0} from "@auth0/auth0-react"
import {api} from "../../api/Api.ts"
import {authAudienceUrl} from "../../api/Urls"
import {setColors} from "../assets/Colors"
import {Spinner} from "../assets/Spinner"

export const Landing: FC = () => {
  const picLink = 'https://lh3.googleusercontent.com/drive-viewer/AEYmBYQTC_YiqwyXOF1fUjFw8ffxlUJS5wqYOtBpWYRwZ33a136Z1Z77bEDBtYk0R7S728K9K8gJTLwVB_SxaywWzLl9D6r2=w2560-h1313'
  const colorMode = 'dark'
  const token = useSelector((state: RootState) => state.editor.token)
  const [isWaiting, setIsWaiting] = useState(false)
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setColors(colorMode)
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    (async () => {
      try {
        setIsWaiting(true)
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: authAudienceUrl,
            scope: 'openid profile email',
          },
        })
        dispatch(actions.setToken(token))
      } catch (e) {
        setIsWaiting(false)
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently])

  useEffect(()=> {
    if (token !== '') {
      dispatch(api.endpoints.signIn.initiate())
    }
  }, [token])

  return (
    <>
      {isWaiting
        ? <Spinner/>
        : <section className="w-screen h-screen bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <section className="bg-white dark:bg-gray-900">
              <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                  <div className="">
                    <h1 className="flex justify-center">MapBoard</h1>
                    {/*<h1 className="rotate-wrap leading-normal flex justify-center ">*/}
                    {/*  <span> &nbsp;</span>*/}
                    {/*  <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Business Analytics</span>*/}
                    {/*  <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r to-teal-600 from-green-400">HR and People Ops</span>*/}
                    {/*  <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r to-orange-600 from-amber-400">Product Management</span>*/}
                    {/*  <span className="rotatingtext text-transparent bg-clip-text bg-gradient-to-r to-sky-600 from-indigo-400">... And More</span>*/}
                    {/*</h1>*/}
                  </div>
                </h1>
                <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
                  AI-Powered Visual Workspaces
                  <br/>
                  For Research, Learning, Analysis and Reporting
                </p>
                <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                  <a href="#"
                     className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                     onClick={() => loginWithRedirect()}
                  >
                    Try Alpha
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#"
                     className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                     onClick={() => window.location.href = "mailto:krisztian@mapboard.io"}
                  >
                    <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                    Contact Us For A Presentation
                  </a>
                </div>
                <br/>
                <div
                  className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[16px] rounded-t-xl h-[344px] max-w-[602px] md:h-[588px] md:max-w-[1024px]">
                  <div className="rounded-lg overflow-hidden h-[312px] md:h-[556px] bg-white dark:bg-gray-800">
                    <img
                      src={picLink}
                      className="hidden dark:block h-[312px] md:h-[556px] w-full rounded-lg" alt=""/>
                  </div>
                </div>
                <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[34px] max-w-[702px] md:h-[42px] md:max-w-[1194px]">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[112px] h-[10px] md:w-[198px] md:h-[16px] bg-gray-800"></div>
                </div>
              </div>
            </section>
          </div>
        </section>
      }
    </>
  )
}
