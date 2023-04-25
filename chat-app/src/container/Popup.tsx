import { motion } from 'framer-motion';
export default function Popup(props:any){
    return(

    <motion.div initial={{ top: '-10%'}}
        animate={{ top: '10%'}}
        transition={{ duration: 1,ease: 'linear' }}
    className="TopToMid absolute top-0 items-center flex flex-col p-10 z-20 backdrop-blur-sm border-2 border-blue-500 rounded-xl">
        <span className="text-white text-lg absolute top-0">{props.title}</span>
        <span className="text-gray-200">{props.description}</span>
    </motion.div>
    )
}