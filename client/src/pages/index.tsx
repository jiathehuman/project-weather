import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
// import { GithubIcon, WeatherIcon } from "@/components/icons";
import RotatingText from "@/blocks/TextAnimations/RotatingText/RotatingText";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg justify-center">
          <p>
          <span className={title()}>Get the current </span>
          <span>
            <RotatingText
              texts={['weather', 'temperature', 'humidity', 'wind speed']}
              mainClassName={title()}
              // mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </span>
          </p>
          <div className={subtitle({ class: "mt-4" })}>
            Come rain or shine, we are here for you.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Login
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.weather}
          >
            Weather now
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
