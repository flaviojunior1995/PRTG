#!/bin/bash

clear
echo -n "Digite o nome do Template:"
read TEMPLNAME
sed -e "s/TEMPLATENAMEX/${TEMPLNAME}/" BASES_TEMPLATE/HEAD.txt > ${TEMPLNAME}.odt

LOOP1=1
while [ $LOOP1 -eq 1 ]
do

	clear 
	echo "Template irá monitorar snmpCPU?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read CPUMON

	if [ $CPUMON -eq 1 ]; then
		cat BASES_TEMPLATE/CPU_LOAD.txt >> ${TEMPLNAME}.odt
		LOOP1=0
	elif [ $CPUMON -eq 2 ]; then
		LOOP1=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi
done

LOOP2=1
while [ $LOOP2 -eq 1 ]
do

	clear
	echo "Template irá monitorar snmpMemory?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read MENMON

	if [ $MENMON -eq 1 ]; then 
		cat BASES_TEMPLATE/MEMORY_MAIN.txt >> ${TEMPLNAME}.odt
		LOOP2=0
	elif [ $MENMON -eq 2 ]; then
		LOOP2=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi
done

LOOP3=1
while [ $LOOP3 -eq 1 ]
do

	clear 
	echo "Template irá monitorar snmpDiskfree?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read DISKMON

	if [ $DISKMON -eq 1 ]; then
		cat BASES_TEMPLATE/DISK_FREE.txt >> ${TEMPLNAME}.odt
		LOOP3=0
	elif [ $DISKMON -eq 2 ]; then
		LOOP3=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi
done

LOOP4=1
while [ $LOOP4 -eq 1 ]
do

	clear
	echo "Template irá monitorar snmpUptime?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read UPTIMEMON
	
	if [ $UPTIMEMON -eq 1 ]; then
		cat BASES_TEMPLATE/UPTIME.txt >> ${TEMPLNAME}.odt
		LOOP4=0
	elif [ $UPTIMEMON -eq 2 ]; then
		LOOP4=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi
done
	
LOOP5=1
while [ $LOOP5 -eq 1 ]
do

	clear
	echo "Monitorar Mikrotik Health?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read HEALTHRBMON
	
	if [ $HEALTHRBMON -eq 1 ]; then
		
		clear
		echo "Qual Modelo Router Board?"
		echo "1 - RB1100"
		echo "2 - hEX lite"
		echo "3 - RB2011"
		echo "4 - CCR1036"
		echo "0 - Nenhuma"
		echo -n ":"
		read RBMODEL
		
		if [ $RBMODEL -eq 1 ]; then
			FREQUENCYNB=1066
		elif [ $RBMODEL -eq 2 ]; then
			FREQUENCYNB=850
		elif [ $RBMODEL -eq 3 ]; then
			FREQUENCYNB=600
		elif [ $RBMODEL -eq 4 ];then
			FREQUENCYNB=1200
		elif [ $RBMODEL -eq 0 ];then
			FREQUENCYNB=0
		else
			echo "OPÇÃO INVALIDA"
			sleep 2
		fi	
		sed -e "s/RBFREQUENCY/${FREQUENCYNB}/" -e "s/RBFREQUENCY/${FREQUENCYNB}/" BASES_TEMPLATE/MIKROTIK_HEALTH.txt >> ${TEMPLNAME}.odt 
		LOOP5=0
		
	elif [ $HEALTHRBMON -eq 2 ];then
		LOOP5=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi		
done
	
LOOP6=1
while [ $LOOP6 = 1 ]
do
	clear
	echo "Monitorar Cisco Health?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read HEALTHCISCOMON
	
	if [ $HEALTHCISCOMON -eq 1 ]; then
		cat BASES_TEMPLATE/CISCO_HEALTH.txt >> ${TEMPLATENAME}.odt
		LOOP6=0
	elif [ $HEALTHCISCOMON -eq 2 ]; then
		LOOP6=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi
done
	
LOOPX=1
while [ $LOOPX -eq 1 ]
do

	clear
	echo "Template irá monitorar Interfaces Staticamente?"
	echo "1 - Sim"
	echo "2 - Não"
	echo -n ":"
	read INTMON
	
	if [ $INTMON -eq 1 ]; then
		
		clear
		echo "##INFORMAÇÕES PARA MONITORAR INTERFACES##"
		echo -n "Quantas intefaces serão monitoradas: "
		read NUMBERSIF
		echo -n "Qual nome para as interfaces: "
		read NAMEIF

		for i in `seq 1 $NUMBERSIF`
		do
			sed -e "s/INTERFACEX/${NAMEIF}${i}/" -e "s/INTERFACEX/${NAMEIF}${i}/" -e "s/NUMEROIFX/${i}/" -e "s/NUMEROIFX/${i}/" -e "s/POSITIONX/${i}000/" BASES_TEMPLATE/BASE_INTERFACE.txt >> ${TEMPLNAME}.odt 
		done
		LOOPX=0
	elif [ $INTMON -eq 2 ]; then
		LOOPX=0
	else
		echo "OPÇÃO INVALIDA"
		sleep 2
	fi
done

if [ $INTMON -eq 2 ]; then

	LOOPX2=1
	while [ $LOOPX2 -eq 1 ]
	do
	
		clear
		echo "Template irá monitorar Interfaces Dinamicamente?"
		echo "1 - Sim"
		echo "2 - Não"
		echo -n ":"
		read INTMON2
	
		if [ $INTMON2 -eq 1 ];then
			cat BASES_TEMPLATE/BASE_INTERFACEDYNAMIC.txt >> ${TEMPLNAME}.odt
			LOOPX2=0
		elif [ $INTMON2 -eq 2 ]; then
			LOOPX2=0
		else
			echo "OPÇÃO INVALIDA"
			sleep 2
		fi
	done
fi

cat BASES_TEMPLATE/END.txt >> ${TEMPLNAME}.odt



