import { BsLightningChargeFill } from "react-icons/bs";
import { RiMenuSearchLine } from "react-icons/ri";
import { FaWallet, FaUser } from "react-icons/fa";
import {Link} from "react-router-dom";
import '../components.css';

const Bar = () => {
    return <div className={'bar'}>
        <Link to={'/'} >
            <BsLightningChargeFill />
        </Link>
        <Link to={'/'} style={{fontSize: '32px'}} >
            <RiMenuSearchLine />
        </Link>
        <Link to={'/'} >
            <FaWallet />
        </Link>
        <Link to={'/'} >
            <FaUser />
        </Link>
    </div>
}

export default Bar;