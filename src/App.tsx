import PWABadge from "./PWABadge";
import { Home } from "./views/Home";

const App: React.FC = () => {
    return (
        <>
            <div className="h-full w-full bg-gradient-to-br from-[#FF0000] via-transparent to-[#FF0000] absolute z-[0] backdrop-blur-xl opacity-5" />

            <Home />

            <PWABadge />
        </>
    );
};

export default App;
