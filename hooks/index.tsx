import Caver, { Contract } from "caver-js";
import { DOLLGROCK_NFT_ABI, DOLLGROCK_NFT_ADDRESS, JOYAKDOL_TOKEN_ABI, JOYAKDOL_TOKEN_ADDRESS } from "caverConfig";
import { useEffect, useRef, useState } from "react";

export const useAccount = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      const accounts = await window.klaytn.enable();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (window.klaytn) {
      getAccount();
    }
  }, []);

  return { account };
};

export const useCaver = () => {
  const [caver, setCaver] = useState<Caver | undefined>(undefined);
  const [dollgrockNFTContract, setDollgrockNFTContract] = useState<Contract | undefined>(
    undefined
  );
  const [joyakdolTokenContract, setJoyakdolTokenContract] = useState<Contract | undefined>(
    undefined
  );

  useEffect(() => {
    if (window.klaytn) {
      setCaver(new Caver(window.klaytn));
    }
  }, []);

  useEffect(() => {
    if (!caver) return;

    setDollgrockNFTContract(caver.contract.create(DOLLGROCK_NFT_ABI, DOLLGROCK_NFT_ADDRESS));

    setJoyakdolTokenContract(caver.contract.create(JOYAKDOL_TOKEN_ABI, JOYAKDOL_TOKEN_ADDRESS));
  }, [caver]);

  return { caver, dollgrockNFTContract, joyakdolTokenContract };
};

export const useAnimate = () => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  const dom = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observe = () => {
      if (dom.current) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) setIsAnimated(true);
          else setIsAnimated(false);
        });
        observer.current.observe(dom.current);

        return () => observer.current && observer.current.disconnect;
      }
    };

    observe();
  }, [dom]);

  return { isAnimated, dom };
};
